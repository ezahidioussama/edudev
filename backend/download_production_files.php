<?php
/**
 * Download missing media/document files from production (Railway) to local
 * Run: php backend/download_production_files.php
 */

$local_host = '127.0.0.1';
$local_db   = 'edudev_final';
$local_user = 'root';
$local_pass = '';

$prod_url_base = 'https://edudev-production.up.railway.app';

echo "=== EduDev Media & Document Downloader ===\n\n";

try {
    $pdo = new PDO("mysql:host=$local_host;dbname=$local_db;charset=utf8mb4", $local_user, $local_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("✗ FAILED to connect to local database: " . $e->getMessage() . "\n");
}

// Helper function to download file
function downloadFile($url, $destPath) {
    $dir = dirname($destPath);
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }

    echo "   Downloading: $url\n";
    echo "   To:          $destPath\n";

    // Set a user agent to avoid blockage
    $options = [
        'http' => [
            'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n",
            'ignore_errors' => true
        ]
    ];
    $context = stream_context_create($options);
    $data = @file_get_contents($url, false, $context);

    if ($data === false) {
        echo "   ✗ Error downloading file.\n\n";
        return false;
    }

    // Check HTTP status code
    if (isset($http_response_header)) {
        preg_match('{HTTP\/\S*\s(\d\d\d)}', $http_response_header[0], $match);
        $status = $match[1] ?? null;
        if ($status !== '200') {
            echo "   ✗ HTTP status code: $status (Failed)\n\n";
            return false;
        }
    }

    if (file_put_contents($destPath, $data) === false) {
        echo "   ✗ Error saving file locally.\n\n";
        return false;
    }

    echo "   ✓ Success!\n\n";
    return true;
}

$download_count = 0;
$fail_count = 0;

// 1. Download Course Documents
echo "--- Scanning Courses for missing documents ---\n";
$courses = $pdo->query("SELECT id, title, document_path, document_disk FROM courses WHERE document_path IS NOT NULL AND document_path != ''")->fetchAll(PDO::FETCH_ASSOC);
foreach ($courses as $course) {
    $disk = $course['document_disk'] ?: 'public';
    $path = $course['document_path'];
    
    // Local destination path
    if ($disk === 'public') {
        $localPath = __DIR__ . '/storage/app/public/' . $path;
    } else {
        $localPath = __DIR__ . '/storage/app/' . $path;
    }

    if (!file_exists($localPath)) {
        echo "[Course #{$course['id']}] '{$course['title']}' is missing file locally.\n";
        $url = $prod_url_base . '/storage/' . $path;
        if (downloadFile($url, $localPath)) {
            $download_count++;
        } else {
            $fail_count++;
        }
    } else {
        echo "[Course #{$course['id']}] '{$course['title']}' file already exists locally.\n";
    }
}

// 2. Download Practical Works
echo "\n--- Scanning Practical Works for missing documents ---\n";
$pws = $pdo->query("SELECT id, title, document_path, document_disk FROM practical_works WHERE document_path IS NOT NULL AND document_path != ''")->fetchAll(PDO::FETCH_ASSOC);
foreach ($pws as $pw) {
    $disk = $pw['document_disk'] ?: 'public';
    $path = $pw['document_path'];
    
    if ($disk === 'public') {
        $localPath = __DIR__ . '/storage/app/public/' . $path;
    } else {
        $localPath = __DIR__ . '/storage/app/' . $path;
    }

    if (!file_exists($localPath)) {
        echo "[Practical Work #{$pw['id']}] '{$pw['title']}' is missing file locally.\n";
        $url = $prod_url_base . '/storage/' . $path;
        if (downloadFile($url, $localPath)) {
            $download_count++;
        } else {
            $fail_count++;
        }
    } else {
        echo "[Practical Work #{$pw['id']}] '{$pw['title']}' file already exists locally.\n";
    }
}

// 3. Download Assessments
echo "\n--- Scanning Assessments for missing documents ---\n";
$assessments = $pdo->query("SELECT id, title, document_path, document_disk FROM assessments WHERE document_path IS NOT NULL AND document_path != ''")->fetchAll(PDO::FETCH_ASSOC);
foreach ($assessments as $ast) {
    $disk = $ast['document_disk'] ?: 'public';
    $path = $ast['document_path'];
    
    if ($disk === 'public') {
        $localPath = __DIR__ . '/storage/app/public/' . $path;
    } else {
        $localPath = __DIR__ . '/storage/app/' . $path;
    }

    if (!file_exists($localPath)) {
        echo "[Assessment #{$ast['id']}] '{$ast['title']}' is missing file locally.\n";
        $url = $prod_url_base . '/storage/' . $path;
        if (downloadFile($url, $localPath)) {
            $download_count++;
        } else {
            $fail_count++;
        }
    } else {
        echo "[Assessment #{$ast['id']}] '{$ast['title']}' file already exists locally.\n";
    }
}

// 4. Download Practical Work Submissions
echo "\n--- Scanning Submissions for missing files ---\n";
$submissions = $pdo->query("SELECT id, file_path, file_disk FROM practical_work_submissions WHERE file_path IS NOT NULL AND file_path != ''")->fetchAll(PDO::FETCH_ASSOC);
foreach ($submissions as $sub) {
    $disk = $sub['file_disk'] ?: 'public';
    $path = $sub['file_path'];
    
    if ($disk === 'public') {
        $localPath = __DIR__ . '/storage/app/public/' . $path;
    } else {
        $localPath = __DIR__ . '/storage/app/' . $path;
    }

    if (!file_exists($localPath)) {
        echo "[Submission #{$sub['id']}] is missing file locally.\n";
        $url = $prod_url_base . '/storage/' . $path;
        if (downloadFile($url, $localPath)) {
            $download_count++;
        } else {
            $fail_count++;
        }
    } else {
        echo "[Submission #{$sub['id']}] file already exists locally.\n";
    }
}

// 5. Download User Avatars
echo "\n--- Scanning Users for missing avatars ---\n";
$users = $pdo->query("SELECT id, first_name, last_name, avatar_path, avatar_disk FROM users WHERE avatar_path IS NOT NULL AND avatar_path != ''")->fetchAll(PDO::FETCH_ASSOC);
foreach ($users as $user) {
    $disk = $user['avatar_disk'] ?: 'local';
    $path = $user['avatar_path'];
    
    if ($disk === 'public') {
        $localPath = __DIR__ . '/storage/app/public/' . $path;
        $url = $prod_url_base . '/storage/' . $path;
    } else {
        $localPath = __DIR__ . '/storage/app/' . $path;
        // Fetch via public avatar route
        $url = $prod_url_base . '/api/profile/avatar/' . $user['id'];
    }

    if (!file_exists($localPath)) {
        echo "[User #{$user['id']}] '{$user['first_name']} {$user['last_name']}' is missing avatar locally.\n";
        if (downloadFile($url, $localPath)) {
            $download_count++;
        } else {
            $fail_count++;
        }
    } else {
        echo "[User #{$user['id']}] '{$user['first_name']} {$user['last_name']}' avatar already exists locally.\n";
    }
}

echo "\n=== DOWNLOAD RUN COMPLETED ===\n";
echo "Successfully downloaded: $download_count files\n";
echo "Failed to download:     $fail_count files\n";

// Ensure storage link is created locally
echo "\n--- Verifying storage symlink ---\n";
$public_storage = __DIR__ . '/public/storage';
if (!file_exists($public_storage)) {
    echo "Storage link 'public/storage' does not exist. Creating it...\n";
    exec('php artisan storage:link', $output, $result);
    echo implode("\n", $output) . "\n";
} else {
    echo "Storage link 'public/storage' already exists.\n";
}
