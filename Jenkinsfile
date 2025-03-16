pipeline {
    agent any
    environment {
        VERCEL_TOKEN = credentials('vercel-token') // Ambil token dari Jenkins Credentials
    }
    triggers {
        githubPush()  // Build otomatis saat ada push ke GitHub
    }
    stages {
        stage('Check Versions') {
            steps {
                echo 'Checking installed versions...'
                bat 'git --version'
                bat 'node -v'
                bat 'npm -v'
                bat 'npx vercel --version'
            }
        }
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                git branch: 'master', 
                    url: 'https://github.com/Alfaturrahman/Omahmu-web-next.git', 
                    credentialsId: 'github-token'
            }
        }
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                bat 'npm install'
            }
        }
        stage('Build') {
            steps {
                echo 'Building the project...'
                bat 'npm run build'
            }
        }
        stage('Deploy to Vercel') {
            steps {
                echo 'Deploying to Vercel...'
                
                // Pastikan `.vercel` ada, jika tidak, jalankan `vercel link`
                bat '''
                if not exist .vercel (
                    echo "Linking Vercel project..."
                    npx vercel link --yes --token %VERCEL_TOKEN%
                ) else (
                    echo "Vercel project already linked."
                )
                '''
                
                // Deploy ke Vercel
                bat 'npx vercel --prod --yes --token %VERCEL_TOKEN%'
            }
        }
        stage('Cleanup Workspace') {
            steps {
                echo 'Cleaning up workspace after deployment...'
                deleteDir()
            }
        }
    }
    post {
        success {
            echo 'Deployment successful! 🎉'
        }
        failure {
            echo 'Deployment failed. Check logs for details. ❌'
        }
    }
}
