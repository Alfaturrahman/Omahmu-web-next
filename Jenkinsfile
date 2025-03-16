pipeline {
    agent any
    environment {
        VERCEL_TOKEN = credentials('vercel-token') // Ambil token dari Jenkins Credentials
    }
    triggers {
        githubPush()  // Build otomatis saat ada push ke GitHub
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
                
                // Jika folder .vercel tidak ada, jalankan "vercel link"
                bat 'if not exist .vercel (npx vercel link --token %VERCEL_TOKEN%)'
                
                // Jalankan deploy
                bat 'npx vercel --prod --yes --token %VERCEL_TOKEN%'
            }
        }
    }
}
