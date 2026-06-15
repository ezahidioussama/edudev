<?php
/**
 * Sync Railway MySQL to Local MySQL (XAMPP)
 * Run: php backend/sync_from_railway.php
 */

// ---- LOCAL config ----
$local_host = '127.0.0.1';
$local_port = 3306;
$local_db   = 'edudev_final';
$local_user = 'root';
$local_pass = '';

// ---- RAILWAY config ----
$remote_host = 'gondola.proxy.rlwy.net';
$remote_port = 48979;
$remote_db   = 'railway';
$remote_user = 'root';
$remote_pass = 'JlvtdeEqZElKukGezmUghKVluIGmdpHn';

echo "=== EduDev Database Pull Tool (Railway -> Local) ===\n\n";

// Connect to Railway
echo "[1/5] Connecting to Railway database...\n";
try {
    $remote = new PDO(
        "mysql:host=$remote_host;port=$remote_port;dbname=$remote_db;charset=utf8mb4",
        $remote_user,
        $remote_pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "      ✓ Connected to Railway '$remote_db'\n\n";
} catch (PDOException $e) {
    die("      ✗ FAILED to connect to Railway: " . $e->getMessage() . "\n");
}

// Connect to local
echo "[2/5] Connecting to local database (XAMPP)...\n";
try {
    $local = new PDO(
        "mysql:host=$local_host;port=$local_port;charset=utf8mb4",
        $local_user,
        $local_pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    // Ensure the database exists or create it
    $local->exec("CREATE DATABASE IF NOT EXISTS `$local_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $local->exec("USE `$local_db`");
    echo "      ✓ Connected to local database '$local_db'\n\n";
} catch (PDOException $e) {
    die("      ✗ FAILED to connect to local MySQL: " . $e->getMessage() . "\n");
}

// Optional Local Backup
echo "[3/5] Backing up local database to local_backup_before_sync.sql...\n";
try {
    $local_tables_stmt = $local->query("SHOW TABLES");
    $local_tables = $local_tables_stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (!empty($local_tables)) {
        $backup_file = __DIR__ . '/local_backup_before_sync.sql';
        $backup_fp = fopen($backup_file, 'w');
        
        fwrite($backup_fp, "-- Local Database Backup before sync\n");
        fwrite($backup_fp, "SET FOREIGN_KEY_CHECKS = 0;\n\n");
        
        foreach ($local_tables as $table) {
            $create_stmt = $local->query("SHOW CREATE TABLE `$table`");
            $create_row = $create_stmt->fetch(PDO::FETCH_ASSOC);
            $create_sql = $create_row['Create Table'] ?? $create_row[array_keys($create_row)[1]];
            
            fwrite($backup_fp, "DROP TABLE IF EXISTS `$table`;\n");
            fwrite($backup_fp, $create_sql . ";\n\n");
            
            $rows_stmt = $local->query("SELECT * FROM `$table`");
            $rows = $rows_stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as $row) {
                $columns = array_keys($row);
                $col_list = '`' . implode('`, `', $columns) . '`';
                $values = array_map(function($v) use ($local) {
                    return $v === null ? 'NULL' : $local->quote($v);
                }, array_values($row));
                fwrite($backup_fp, "INSERT INTO `$table` ($col_list) VALUES (" . implode(', ', $values) . ");\n");
            }
            fwrite($backup_fp, "\n");
        }
        
        fwrite($backup_fp, "SET FOREIGN_KEY_CHECKS = 1;\n");
        fclose($backup_fp);
        echo "      ✓ Backup saved to " . realpath($backup_file) . "\n\n";
    } else {
        echo "      ✓ No local tables to backup.\n\n";
    }
} catch (Exception $e) {
    echo "      ⚠ WARNING: Could not complete backup: " . $e->getMessage() . ". Continuing sync...\n\n";
}

// Get all tables from Railway
echo "[4/5] Reading Railway database structure...\n";
try {
    $tables_stmt = $remote->query("SHOW TABLES");
    $tables = $tables_stmt->fetchAll(PDO::FETCH_COLUMN);
} catch (PDOException $e) {
    die("      ✗ FAILED to fetch Railway tables: " . $e->getMessage() . "\n");
}

if (empty($tables)) {
    die("      ✗ No tables found in Railway database '$remote_db'.\n");
}
echo "      Found " . count($tables) . " tables in production: " . implode(', ', $tables) . "\n\n";

// Copy data from Railway to local
echo "[5/5] Copying tables and data from Railway to local...\n";
$local->exec("SET FOREIGN_KEY_CHECKS = 0");
$local->exec("SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO'");

$total_rows = 0;

foreach ($tables as $table) {
    echo "      -> Table: $table ";
    
    // Get create table statement from Railway
    try {
        $create_stmt = $remote->query("SHOW CREATE TABLE `$table`");
        $create_row = $create_stmt->fetch(PDO::FETCH_ASSOC);
        $create_sql = $create_row['Create Table'] ?? $create_row[array_keys($create_row)[1]];
        
        // Drop existing local table
        $local->exec("DROP TABLE IF EXISTS `$table`");
        
        // Create local table
        $local->exec($create_sql);
    } catch (PDOException $e) {
        echo "[SKIP - schema replication error: " . $e->getMessage() . "]\n";
        continue;
    }
    
    // Get data from Railway
    try {
        $rows_stmt = $remote->query("SELECT * FROM `$table`");
        $rows = $rows_stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo "[SKIP - fetch data error: " . $e->getMessage() . "]\n";
        continue;
    }
    
    if (empty($rows)) {
        echo "(empty)\n";
        continue;
    }
    
    // Build batch insert
    $columns = array_keys($rows[0]);
    $col_list = '`' . implode('`, `', $columns) . '`';
    
    $batch_size = 50;
    $chunks = array_chunk($rows, $batch_size);
    
    $inserted_count = 0;
    foreach ($chunks as $chunk) {
        $values_list = [];
        foreach ($chunk as $row) {
            $values = array_map(function($v) use ($local) {
                return $v === null ? 'NULL' : $local->quote($v);
            }, array_values($row));
            $values_list[] = '(' . implode(', ', $values) . ')';
        }
        $insert_sql = "INSERT INTO `$table` ($col_list) VALUES " . implode(', ', $values_list);
        try {
            $local->exec($insert_sql);
            $inserted_count += count($chunk);
        } catch (PDOException $e) {
            echo "\n        [INSERT ERROR on $table]: " . $e->getMessage() . "\n";
        }
    }
    
    $total_rows += $inserted_count;
    echo "($inserted_count rows)\n";
}

$local->exec("SET FOREIGN_KEY_CHECKS = 1");

echo "\n=== DONE ===\n";
echo "Total rows transferred to local: $total_rows\n";
echo "Your local XAMPP database now mirrors your production Railway database!\n";
