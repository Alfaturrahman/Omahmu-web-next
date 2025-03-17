pipeline {
    agent any
    environment {
        VERCEL_TOKEN = credentials('vercel-token') // Mengambil token dari Jenkins Credentials
    }
    triggers {
        githubPush() // Build otomatis saat ada push ke GitHub
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
        stage('Cleanup Workspace') {
            steps {
                echo 'Cleaning up workspace...'
                deleteDir() // Menghapus semua file di workspace Jenkins untuk fresh build
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
        stage('Check Tailwind Config') {
            steps {
                echo 'Checking Tailwind CSS configuration...'
                bat 'if not exist tailwind.config.js npx tailwindcss init -p'
            }
        }
        stage('Build Tailwind CSS') {
            steps {
                echo 'Building Tailwind CSS...'
                bat 'npx tailwindcss -i ./styles/globals.css -o ./public/output.css'
            }
        }
        stage('Build Next.js') {
            steps {
                echo 'Building the Next.js project...'
                bat 'npm run build'
            }
        }
        stage('Deploy to Vercel') {
            steps {
                echo 'Deploying to Vercel...'

                // Hapus folder `.vercel` untuk memastikan fresh deployment
                bat 'if exist .vercel ( rmdir /s /q .vercel )'

                // Pastikan proyek Vercel terhubung dengan benar
                bat '''
                echo "Linking Vercel project..."
                npx vercel link --project omahmu-web --yes --token %VERCEL_TOKEN%
                '''

                // Hapus cache sebelum deploy
                bat 'npx vercel build --force --token %VERCEL_TOKEN%'

                // Deploy ke Vercel
                bat 'npx vercel deploy --prod --yes --token %VERCEL_TOKEN%'
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
