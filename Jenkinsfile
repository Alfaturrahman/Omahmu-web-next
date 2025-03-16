pipeline {
    agent any
    environment {
        VERCEL_TOKEN = credentials('vercel-token') // Mengambil token dari Jenkins Credentials
    }
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
                bat 'npm install'
                bat 'npm run build'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying to Vercel...'
                bat 'npx vercel --prod --token %VERCEL_TOKEN%'
            }
        }
    }
}
