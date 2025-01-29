# Evaluation viewer

To make cors work locally I used:

```sh
sudo snap install google-cloud-cli --classic
gcloud auth login
gsutil cors set cors.json gs://gs-on-a-budget.firebasestorage.app
```

To deploy the frontend and firebase config use:

```sh
npm run build
firebase deploy
```

To deploy the python cloud-function use:

```sh
gcloud functions deploy get_next_pair \
  --runtime python310 \
  --trigger-http \
  --allow-unauthenticated \
  --project gs-on-a-budget \
  --region=us-east1
```

To test the cloud function you can use:

```sh
curl -X POST https://us-east1-gs-on-a-budget.cloudfunctions.net/get_next_pair \
     -H "Content-Type: application/json" \
     -d '{
           "previous_dataset": "truck",
            "previous_previous_dataset": "room",
            "previous_model_size": "low",
            "previous_previous_model_size": "medium"
         }'
```