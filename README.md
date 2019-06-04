# messenger-backend
Messenger App backend.

## How to run

* Install MongoDB Community Edition
* *git clone https://github.com/kamilwronka/messenger-backend.git*
* *cd messenger-backend*
* *yarn* or *npm install*
* Set your env variables as following: MONGODB_URI=your_mongodb_database, AWS_SECRET=your_aws_s3_secret_key, AWS_ACCESS=s3_access_key (both are required for images and photos upload to work), FCM_SENDER=firebase_cloud_messaging_key
* *yarn start
