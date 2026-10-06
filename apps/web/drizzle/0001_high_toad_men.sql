ALTER TABLE "leads" ADD COLUMN "job_title" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "employee_band" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "levy_payer" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "interests" jsonb DEFAULT '[]'::jsonb NOT NULL;