from bcrypt import checkpw, gensalt, hashpw


class HashHelper:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify user password

        Args:
            plain_password (str): plain password
            hashed_password (str): hashed password

        Returns:
            bool: True if password is valid, False otherwise
        """

        if checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8")):
            return True
        return False

    @staticmethod
    def get_password_hash(password: str):
        """
        Hash user password

        Args:
            password (str): plain password

        Returns:
            str: hashed password
        """

        return hashpw(password.encode("utf-8"), gensalt()).decode("utf-8")
