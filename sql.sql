-- Database: agileSoftTest

-- DROP DATABASE IF EXISTS "agileSoftTest";

CREATE DATABASE "agileSoftTest"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Colombia.1252'
    LC_CTYPE = 'Spanish_Colombia.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
-- Table: public.Tasks

-- DROP TABLE IF EXISTS public."Tasks";

CREATE TABLE IF NOT EXISTS public."Tasks"
(
    "Id" uuid NOT NULL,
    "UserId" text COLLATE pg_catalog."default" NOT NULL,
    "Name" text COLLATE pg_catalog."default" NOT NULL,
    "Status" boolean NOT NULL,
    "Description" text COLLATE pg_catalog."default",
    "CreatedOn" timestamp with time zone DEFAULT now(),
    "UpdatedOn" time with time zone DEFAULT now(),
    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("Id", "UserId")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Tasks"
    OWNER to postgres;
	
-- Table: public.Users

-- DROP TABLE IF EXISTS public."Users";

CREATE TABLE IF NOT EXISTS public."Users"
(
    "Id" uuid NOT NULL,
    "Name" text COLLATE pg_catalog."default" NOT NULL,
    "UserName" text COLLATE pg_catalog."default" NOT NULL,
    "Password" text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY ("Id")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Users"
    OWNER to postgres;
