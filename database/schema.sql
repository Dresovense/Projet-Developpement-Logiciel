CREATE TABLE IF NOT EXISTS "branche" (
	"id" INTEGER NOT NULL UNIQUE,
	"nom" TEXT NOT NULL UNIQUE,
	"faculte" TEXT NOT NULL,
	PRIMARY KEY("id")	
);

CREATE TABLE IF NOT EXISTS "cours" (
	"id" INTEGER NOT NULL UNIQUE,
	"nom" TEXT NOT NULL UNIQUE,
	"credits" TEXT NOT NULL,
	"langage" TEXT NOT NULL,
	"objectif" TEXT,
	"contenu" TEXT,
	"exigences" TEXT,
	"evaluation" TEXT,
	"semestre" TEXT NOT NULL,
	"url" TEXT NOT NULL,
	"prog_op" TEXT,
	"brancheid" INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY ("brancheid") REFERENCES "branche"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "horaire" (
	"id" INTEGER NOT NULL UNIQUE,
	"horaire" TEXT NOT NULL,
	"jour" TEXT NOT NULL,
	PRIMARY KEY("id")	
);

CREATE TABLE IF NOT EXISTS "cours_has_horaire" (
	"coursid" INTEGER NOT NULL,
	"horaireid" INTEGER NOT NULL,
	"brancheid" INTEGER NOT NULL,
	PRIMARY KEY("coursid", "horaireid", "brancheid"),
	FOREIGN KEY ("coursid") REFERENCES "cours"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "intervenant" (
	"id" INTEGER NOT NULL UNIQUE,
	"nom" TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id")	
);

CREATE TABLE IF NOT EXISTS "cours_has_intervenant" (
	"intervenantid" INTEGER NOT NULL,
	"coursid" INTEGER NOT NULL,
	"brancheid" INTEGER NOT NULL,
	PRIMARY KEY("intervenantid", "coursid", "brancheid"),
	FOREIGN KEY ("intervenantid") REFERENCES "intervenant"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);
