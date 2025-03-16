pipeline {
    agent any
    triggers {
        githubPush()  // Memicu build otomatis saat ada push
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/user/proyek.git'
            }
        }
        stage('Build') {
            steps {
                echo 'Building the project...'
                // Jika pakai Node.js:
                // sh 'npm install && npm run build'
                // Jika pakai PHP:
                // sh 'composer install'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                // Tambahkan langkah deploy ke server jika perlu
            }
        }
    }
}
