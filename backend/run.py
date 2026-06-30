import os
from dotenv import load_dotenv
load_dotenv()

from app import create_app

config_object = os.getenv("FLASK_CONFIG", "config.DevelopmentConfig")
app = create_app(config_class=config_object)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
