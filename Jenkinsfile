pipeline {
    agent any
    triggers {
        githubPush()  // Memicu build otomatis saat ada push
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', 
                    url: 'https://github.com/Alfaturrahman/Omahmu-web-next.git', 
                    credentialsId: 'github-token'
            }
        }
        stage('Build') {
            steps {
                echo 'Building the project...'
                bat 'npm install'  // Ganti `sh` dengan `bat`
                bat 'npm run build'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                // Tambahkan langkah deploy jika perlu
            }
        }
    }
}
