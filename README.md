# Evaluation viewer

To make cors work locally I used:

```sh
sudo snap install google-cloud-cli --classic
gcloud auth login
gsutil cors set cors.json gs://gs-on-a-budget.firebasestorage.app
```