pipeline{
    agent any
    options{
        timestamps()
    }

    stages{
        stage('checkout'){
            steps{
                echo 'Source code checked out successfully'
            }
        }
        stage('Verify Docker'){
            steps{
                sh 'docker version'
                sh 'docker compose version'
            }
        }
        stage('Build backend image'){
            steps{
                sh 'docker build -t buzzcircle-backend:latest .'
            }
        }
        stage('Build Frontend Image') {
            steps {
                dir('new_ui') {
                    sh 'docker build -t buzzcircle-frontend:latest .'
                }
            }
        }
        stage('Verify Images'){
            steps{
                sh 'docker images'
            }
        }
    }
    post{
        success{
            echo 'BuzzCircle CI pipeline completed successfully!'
        }
        failure{
            echo 'BuzzCircle CI pipeline failed. Check the console logs.'
        }
    }
}