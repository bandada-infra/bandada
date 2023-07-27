-- Table Definition ----------------------------------------------

CREATE TABLE admins (
    id character varying PRIMARY KEY,
    address character varying NOT NULL UNIQUE,
    username character varying NOT NULL UNIQUE,
    created_at timestamp without time zone NOT NULL DEFAULT now()
);

-- Table Definition ----------------------------------------------

CREATE TABLE groups (
    id character varying(32) PRIMARY KEY,
    name character varying NOT NULL,
    description character varying NOT NULL,
    admin_id character varying NOT NULL,
    tree_depth integer NOT NULL,
    fingerprint_duration integer NOT NULL,
    reputation_criteria text,
    api_enabled boolean NOT NULL DEFAULT false,
    api_key character varying,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now()
);

-- Table Definition ----------------------------------------------

CREATE TABLE members (
    id character varying PRIMARY KEY,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    group_id character varying(32) REFERENCES groups(id),
    CONSTRAINT "UQ_db97b66d973228a2049c76f89e2" UNIQUE (id, group_id)
);

-- Table Definition ----------------------------------------------

CREATE TABLE reputation_accounts (
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
ALTER TABLE "members" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");
ALTER TABLE "invites" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");
ALTER TABLE "reputation_accounts" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");
