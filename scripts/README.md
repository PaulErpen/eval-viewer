# Scripts

Environment:

```sh
conda env create -f environment.yml
```

Usage:

```sh
python3 scripts/set-custom-claims.py \
    --serviceAccountKeyPath ./keys/gs-on-a-budget-firebase-adminsdk-63ws0-509fffaf5f.json \
    -u kvjF6EnhpuX6AUdctcLFJfQg7Fm1 \
    -r admin
```

```sh
python3 scripts/reset-database.py \
    --serviceAccountKeyPath ./keys/gs-on-a-budget-firebase-adminsdk-63ws0-509fffaf5f.json
```

```sh
python3 scripts/upload-files.py -p keys/gs-on-a-budget-firebase-adminsdk-63ws0-509fffaf5f.json  -f /home/paul/Downloads/vsc-models -s splats
```
