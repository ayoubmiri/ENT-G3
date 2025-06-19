# from cassandra.cluster import Cluster
# from cassandra.auth import PlainTextAuthProvider
# import os
# from uuid import uuid4

# CASSANDRA_HOST = os.getenv("CASSANDRA_HOST", "cassandra")
# CASSANDRA_KEYSPACE = os.getenv("CASSANDRA_KEYSPACE", "est_keyspace")

# auth_provider = PlainTextAuthProvider(username='cassandra', password='cassandra')
# cluster = Cluster([CASSANDRA_HOST], auth_provider=auth_provider)
# session = cluster.connect()

# # Ensure keyspace is set globally
# def init_db():
#     print("📦 Initializing Cassandra keyspace and table...")
#     session.execute(f"""
#         CREATE KEYSPACE IF NOT EXISTS {CASSANDRA_KEYSPACE}
#         WITH replication = {{'class': 'SimpleStrategy', 'replication_factor': 1}}
#     """)
#     session.set_keyspace(CASSANDRA_KEYSPACE)
#     session.execute("""
#     CREATE TABLE IF NOT EXISTS users (
#         id text PRIMARY KEY,
#         username text,
#         email text,
#         first_name text,
#         last_name text,
#         roles list<text>
#     )
#     """)
#     print("✅ Cassandra initialized.")

# # Set keyspace after init
# init_db()

# def get_user_by_id(user_id: str):
#     try:
#         session.set_keyspace(CASSANDRA_KEYSPACE)
#         result = session.execute("SELECT * FROM users WHERE id=%s", (user_id,))
#         return result.one()
#     except Exception as e:
#         print(f"❌ Error fetching user by ID: {e}")
#         return None

# def insert_user(user):
#     try:
#         session.set_keyspace(CASSANDRA_KEYSPACE)
#         print(f"🔄 Inserting user into Cassandra: {user.username} | {user.id}")
#         session.execute("""
#             INSERT INTO users (id, username, email, first_name, last_name, roles)
#             VALUES (%s, %s, %s, %s, %s, %s)
#         """, (
#             user.id,
#             user.username,
#             user.email,
#             user.first_name,
#             user.last_name,
#             user.roles or []
#         ))
#         print("✅ User inserted successfully.")
#     except Exception as e:
#         print(f"❌ Failed to insert user: {e}")

