-- Table Definition ----------------------------------------------

CREATE TABLE "admins" (
    "id" varchar PRIMARY KEY,
    "address" varchar UNIQUE NOT NULL,
    "username" varchar NOT NULL,
    "created_at" timestamp without time zone DEFAULT (now()),
    "updated_at" timestamp without time zone DEFAULT null
);

-- Table Definition ----------------------------------------------

CREATE TABLE "groups" (
    "id" varchar PRIMARY KEY,
    "admin_id" varchar NOT NULL,
    "name" varchar NOT NULL,
    "description" varchar NOT NULL,
    "tree_depth" int NOT NULL,
    "api_enabled" booloan DEFAULT false,
    "api_key" varchar DEFAULT null,
    "reputation_criteria" json,
    "created_at" timestamp without time zone DEFAULT (now()),
    "updated_at" timestamp without time zone DEFAULT null
);

-- Table Definition ----------------------------------------------

CREATE TABLE "members" (
    "id" varchar NOT NULL,
    "group_id" varchar NOT NULL,
    "created_at" timestamp without time zone DEFAULT (now()),
    PRIMARY KEY ("id", "group_id")
);

-- Table Definition ----------------------------------------------

CREATE TABLE "reputation_accounts" (
  "account_hash" varchar PRIMARY KEY,
  "group_id" varchar NOT NULL
);

-- Table Definition ----------------------------------------------

CREATE TABLE "invites" (
  "id" varchar PRIMARY KEY,
  "code" varchar UNIQUE NOT NULL,
  "group_id" varchar NOT NULL,
  "is_redeemed" booloan DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

ALTER TABLE "groups" ADD FOREIGN KEY ("admin_id") REFERENCES "admins" ("address");
ALTER TABLE "members" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");
ALTER TABLE "invites" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");
ALTER TABLE "reputation_accounts" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");
