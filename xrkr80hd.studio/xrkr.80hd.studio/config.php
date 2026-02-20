<?php
/**
 * XRKR80HD Studio - Configuration
 * SQLite version - No external database server needed!
 */

// Site settings
define('SITE_NAME', 'XRKR80HD Studio');
define('SITE_URL', 'http://localhost:8000');  // Change for production

// Database file location
define('DB_FILE', __DIR__ . '/data/studio.db');

// Upload paths
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('IMAGES_DIR', UPLOAD_DIR . 'images/');
define('MUSIC_DIR', UPLOAD_DIR . 'music/');

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Get database connection (creates database if needed)
 */
function getDB() {
    static $db = null;
    
    if ($db === null) {
        // Create data directory if needed
        $dataDir = dirname(DB_FILE);
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
        
        $isNew = !file_exists(DB_FILE);
        
        $db = new PDO('sqlite:' . DB_FILE);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        
        // Initialize database if new
        if ($isNew) {
            initDatabase($db);
        }
    }
    
    return $db;
}

/**
 * Initialize database tables
 */
function initDatabase($db) {
    $db->exec("
        CREATE TABLE IF NOT EXISTS bands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            years_active TEXT,
            genre TEXT,
            era TEXT DEFAULT 'memory-lane',
            tagline TEXT,
            description TEXT,
            story TEXT,
            image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $db->exec("
        CREATE TABLE IF NOT EXISTS band_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            band_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            role TEXT,
            image TEXT,
            sort_order INTEGER DEFAULT 0,
            FOREIGN KEY (band_id) REFERENCES bands(id) ON DELETE CASCADE
        )
    ");
    
    $db->exec("
        CREATE TABLE IF NOT EXISTS band_tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            band_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            album TEXT,
            duration TEXT,
            filename TEXT,
            sort_order INTEGER DEFAULT 0,
            FOREIGN KEY (band_id) REFERENCES bands(id) ON DELETE CASCADE
        )
    ");
    
    $db->exec("
        CREATE TABLE IF NOT EXISTS band_gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            band_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            caption TEXT,
            sort_order INTEGER DEFAULT 0,
            FOREIGN KEY (band_id) REFERENCES bands(id) ON DELETE CASCADE
        )
    ");
    
    $db->exec("
        CREATE TABLE IF NOT EXISTS my_tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            artist TEXT DEFAULT 'XRKR80HD',
            filename TEXT NOT NULL,
            duration TEXT,
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $db->exec("
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $db->exec("CREATE INDEX IF NOT EXISTS idx_bands_era ON bands(era)");
    $db->exec("CREATE INDEX IF NOT EXISTS idx_bands_genre ON bands(genre)");
    
    // Create default admin user (password: admin123)
    $hash = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT OR IGNORE INTO admin_users (username, password) VALUES (?, ?)");
    $stmt->execute(['admin', $hash]);
    
    // Create upload directories
    @mkdir(IMAGES_DIR, 0755, true);
    @mkdir(MUSIC_DIR, 0755, true);
    @mkdir(MUSIC_DIR . 'bands/', 0755, true);
}

function slugify($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    return strtolower($text) ?: 'item';
}

function e($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

function isLoggedIn() {
    return isset($_SESSION['admin_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: /login.php');
        exit;
    }
}

function getBandsByEra($era) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM bands WHERE era = ? ORDER BY name");
    $stmt->execute([$era]);
    return $stmt->fetchAll();
}

function getBand($idOrSlug) {
    $db = getDB();
    
    if (is_numeric($idOrSlug)) {
        $stmt = $db->prepare("SELECT * FROM bands WHERE id = ?");
    } else {
        $stmt = $db->prepare("SELECT * FROM bands WHERE slug = ?");
    }
    $stmt->execute([$idOrSlug]);
    $band = $stmt->fetch();
    
    if ($band) {
        $stmt = $db->prepare("SELECT * FROM band_members WHERE band_id = ? ORDER BY sort_order");
        $stmt->execute([$band['id']]);
        $band['members'] = $stmt->fetchAll();
        
        $stmt = $db->prepare("SELECT * FROM band_tracks WHERE band_id = ? ORDER BY sort_order");
        $stmt->execute([$band['id']]);
        $band['tracks'] = $stmt->fetchAll();
        
        $stmt = $db->prepare("SELECT * FROM band_gallery WHERE band_id = ? ORDER BY sort_order");
        $stmt->execute([$band['id']]);
        $band['gallery'] = $stmt->fetchAll();
    }
    
    return $band;
}

function getMyTracks() {
    $db = getDB();
    return $db->query("SELECT * FROM my_tracks ORDER BY sort_order")->fetchAll();
}
