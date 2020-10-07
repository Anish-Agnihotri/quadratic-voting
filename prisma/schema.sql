CREATE TABLE "public"."Events"
(
  id uuid DEFAULT uuid_generate_v4 (),
  secret_key uuid DEFAULT uuid_generate_v4 (),
  event_title VARCHAR,
  event_description VARCHAR,
  num_voters INTEGER NOT NULL DEFAULT 10,
  credits_per_voter INTEGER NOT NULL DEFAULT 5,
  start_event_date TIMESTAMP NOT NULL DEFAULT NOW(),
  end_event_date TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  event_data JSON,
  PRIMARY KEY (id)
);

CREATE TABLE "public"."Voters"
(
  id uuid DEFAULT uuid_generate_v4 (),
  event_uuid uuid NOT NULL,
  voter_name VARCHAR,
  vote_data JSON,
  PRIMARY KEY (id),
  FOREIGN KEY ("event_uuid") REFERENCES "public"."Events"(id)
);