# GS on a Budget - Evaluation Viewer

This repository implements the custom evaluation tool
used for surveying subjective quality of Gaussian Splatting models for the masters thesis "Gaussians on a Budget - Surveying subjective and objective indicators for Gaussian Splatting heuristics".

A working demo of the tool can be found [here](https://gs-on-a-budget.firebaseapp.com/).

## Running locally

To run the frontend locally use:

```sh
npm run dev
```

To make cors work locally use:

```sh
sudo snap install google-cloud-cli --classic
gcloud auth login
gsutil cors set cors.json gs://gs-on-a-budget.firebasestorage.app
```

The frontend depends on the `next_pair` cloud function,
which has to be deployed for the application to work.

## Deployment

To deploy the frontend and firebase config use:

```sh
npm run build
firebase deploy
```

### Cloud Functions

There are two cloud functions that are critical to the functioning of this application.
The `next_pair` function determines the next comparison pair that is presented to participants.
The `update_priority` function is called at regular intervals by a scheduled job.
It creates a cached data structure to aggregate rating counts and speed up the next pair computation.

### `next_pair` function

To deploy the python cloud-function use:

```sh
gcloud functions deploy get_next_pair \
  --runtime python310 \
  --trigger-http \
  --allow-unauthenticated \
  --project gs-on-a-budget \
  --region=us-east1 \
  --memory=512M
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

or:

```sh
curl -X POST https://us-east1-gs-on-a-budget.cloudfunctions.net/get_next_pair \
     -H "Content-Type: application/json" \
     -d '{
           "previousPairs": []
         }'
```


### `update_priority` function

To deploy the function use:

```sh
gcloud functions deploy update_priority --runtime python310 \
  --trigger-http \
  --allow-unauthenticated \
  --project gs-on-a-budget \
  --region=us-east1 \
  --memory=512M
```

Dont forget to actually schedule the job in the Google Cloud console.

Test the function using:

```sh
curl https://us-east1-gs-on-a-budget.cloudfunctions.net/update_priority
```