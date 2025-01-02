import argparse

import firebase_admin
from firebase_admin import credentials
import firebase_admin.auth


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--serviceAccountKeyPath",
        "-p",
        type=str,
        help="The path to the service account key",
        required=True,
    )
    parser.add_argument(
        "--userId", "-u", type=str, help="The user id to modify", required=True
    )
    parser.add_argument(
        "--role",
        "-r",
        type=str,
        help="The role to set, revoke all claims if missing",
        required=False,
    )

    parsed_args = parser.parse_args()

    cred = credentials.Certificate(parsed_args.serviceAccountKeyPath)
    firebase_admin.initialize_app(cred)

    firebase_admin.auth.set_custom_user_claims(
        parsed_args.userId,
        {"role": parsed_args.role} if parsed_args.role != None else {},
    )
