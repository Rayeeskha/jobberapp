def namespace = "production"
def serviceName = "jobber-order"
def service = "Jobber Reviews"

def groovyMethods
def m1 = System.currentTimeMillis()

pipeline {
    agent {
        label 'Jenkins-Agent'
    }

    tools {
        nodejs "NodeJS"
        dockerTool "Docker"
    }

    environment {
        NPM_TOKEN = credentials('NPM_TOKEN')
        DOCKER_CREDENTIALS = credentials('dockerhub')
        SLACK_WEBHOOK = credentials("slack-webhook")

        IMAGE_NAME = "rayeeskhandev/jobber-review"
        IMAGE_TAG = "stable-${BUILD_NUMBER}"
    }

    stages {

        stage("Cleanup Workspace") {
            steps {
                cleanWs()
            }
        }

        stage("Prepare Environment") {
            steps {

                sh "[ -d pipeline ] || mkdir pipeline"

                dir("pipeline") {
                    git(
                        branch: 'main',
                        credentialsId: 'github',
                        url: 'https://github.com/Rayeeskha/jenkins-automation'
                    )

                    script {
                        groovyMethods = load("functions.groovy")
                    }
                }

                git(
                    branch: 'main',
                    credentialsId: 'github',
                    url: 'https://github.com/Rayeeskha/jobber-order-service'
                )
            }
        }

        stage("Verify Credentials") {
            steps {
                sh '''
                    echo "Checking NPM token..."
                    if [ -n "$NPM_TOKEN" ]; then
                        echo "NPM_TOKEN OK"
                    else
                        echo "NPM_TOKEN MISSING"
                        exit 1
                    fi

                    echo "Checking Docker credentials..."
                    if [ -n "$DOCKER_CREDENTIALS_USR" ]; then
                        echo "Docker Credentials OK"
                    else
                        echo "Docker Credentials MISSING"
                        exit 1
                    fi
                '''
            }
        }

        stage("Install Dependencies") {
            steps {
                sh 'npm install'
            }
        }

        stage("Lint Check") {
            steps {
                sh 'npm run lint:check'
            }
        }

        stage("Code Format Check") {
            steps {
                sh 'npm run prettier:check'
            }
        }

        stage("Unit Test") {
            steps {
                sh 'npm run test'
            }
        }

        stage("Verify Docker Credentials") {
            steps {
                sh '''
                echo "USER=$DOCKER_CREDENTIALS_USR"
                [ -n "$DOCKER_CREDENTIALS_USR" ] && echo "Username OK"
                [ -n "$DOCKER_CREDENTIALS_PSW" ] && echo "Password OK"
                '''
            }
        }

        stage("Build and Push") {
            steps {

                sh '''
                docker login \
                -u "$DOCKER_CREDENTIALS_USR" \
                -p "$DOCKER_CREDENTIALS_PSW"
                '''

                sh '''
                  docker build \
                    --build-arg NPM_TOKEN=$NPM_TOKEN \
                    -t $IMAGE_NAME .
                  '''

                sh "docker tag ${IMAGE_NAME} ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker tag ${IMAGE_NAME} ${IMAGE_NAME}:stable"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:stable"
            }
        }

        stage("Clean Artifacts") {
            steps {
                sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
                sh "docker rmi ${IMAGE_NAME}:stable || true"
            }
        }

        // stage("Create New Pods") {
        //     steps {
        //         withKubeCredentials(
        //             kubectlCredentials: [[
        //                 caCertificate: '',
        //                 clusterName: 'docker-desktop',
        //                 contextName: 'docker-desktop',
        //                 credentialsId: 'jenkins-k8s-token',
        //                 namespace: '',
        //                 serverUrl: 'https://kubernetes.docker.internal:6443'
        //             ]]
        //         ) {
        //             script {
        //                 def pods = groovyMethods.findPodsFromName(namespace, serviceName)

        //                 for (podName in pods) {
        //                     sh """
        //                         kubectl delete -n ${namespace} pod ${podName}
        //                         sleep 10
        //                     """
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    post {

        success {
            script {

                if (groovyMethods == null) {
                    return
                }

                def m2 = System.currentTimeMillis()

                def durTime = groovyMethods.durationTime(m1, m2)
                def author = groovyMethods.readCommitAuthor()

                groovyMethods.notifySlack(
                    "",
                    "jobber-jenkins",
                    [[
                        title      : "BUILD SUCCEEDED: ${service} Service with build number ${env.BUILD_NUMBER}",
                        title_link : "${env.BUILD_URL}",
                        color      : "good",
                        text       : "Created by: ${author}",
                        mrkdwn_in  : ["fields"],
                        fields     : [
                            [
                                title : "Duration Time",
                                value : durTime,
                                short : true
                            ],
                            [
                                title : "Stage Name",
                                value : "Production",
                                short : true
                            ]
                        ]
                    ]]
                )
            }
        }

        failure {
            script {

                if (groovyMethods == null) {
                    return
                }

                def m2 = System.currentTimeMillis()

                def durTime = groovyMethods.durationTime(m1, m2)
                def author = groovyMethods.readCommitAuthor()

                groovyMethods.notifySlack(
                    "",
                    "jobber-jenkins",
                    [[
                        title      : "BUILD FAILED: ${service} Service with build number ${env.BUILD_NUMBER}",
                        title_link : "${env.BUILD_URL}",
                        color      : "danger",
                        text       : "Created by: ${author}",
                        mrkdwn_in  : ["fields"],
                        fields     : [
                            [
                                title : "Duration Time",
                                value : durTime,
                                short : true
                            ],
                            [
                                title : "Stage Name",
                                value : "Production",
                                short : true
                            ]
                        ]
                    ]]
                )
            }
        }
    }
}
