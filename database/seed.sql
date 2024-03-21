-- Table Definition ----------------------------------------------

CREATE TABLE admins (
    id character varying PRIMARY KEY,
    address character varying NOT NULL UNIQUE,
    username character varying NOT NULL UNIQUE,
    api_key character varying,
    api_enabled boolean NOT NULL DEFAULT false,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now()
);

-- Table Definition ----------------------------------------------

CREATE TABLE groups (
    id character varying(32) PRIMARY KEY,
    name character varying NOT NULL,
    description character varying NOT NULL,
    admin_id character varying NOT NULL,
    tree_depth integer NOT NULL,
    fingerprint_duration integer NOT NULL,
    credentials text,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now()
);

-- Table Definition ----------------------------------------------

CREATE TABLE members (
    id character varying PRIMARY KEY,
    created_at timestamp without time zone NOT NULL DEFAULT now()
);

-- Table Definition ----------------------------------------------

CREATE TABLE memberships (
    "group" character varying(32) REFERENCES groups(id),
    member character varying REFERENCES members(id),
    CONSTRAINT "PK_91a108ed26822c9aaf95c5ed30e" PRIMARY KEY ("group", member)
);

-- Table Definition ----------------------------------------------

CREATE TABLE oauth_accounts (
    "accountHash" character varying PRIMARY KEY,
    group_id character varying(32) REFERENCES groups(id),
    CONSTRAINT "UQ_f053a0e63cc508da7d0eccc677b" UNIQUE ("accountHash", group_id)
);

-- Table Definition ----------------------------------------------

CREATE TABLE invites (
    id SERIAL PRIMARY KEY,
    code character varying NOT NULL,
    is_redeemed boolean NOT NULL DEFAULT false,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    group_id character varying(32) REFERENCES groups(id)
);

ALTER TABLE "groups" ADD FOREIGN KEY ("admin_id") REFERENCES "admins" ("id");
ALTER TABLE "invites" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");
ALTER TABLE "oauth_accounts" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

CREATE INDEX "IDX_98688b164e38f522c6b4ade701" ON memberships("group" text_ops);
CREATE INDEX "IDX_772286a3c5154724324fd55eaf" ON memberships(member text_ops);
