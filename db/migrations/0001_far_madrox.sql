CREATE TABLE "equipment_master" (
	"id" text PRIMARY KEY NOT NULL,
	"equipment_name" text NOT NULL,
	"parent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"project_name" text NOT NULL,
	"project_number" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_project_number_unique" UNIQUE("project_number")
);
--> statement-breakpoint
CREATE TABLE "purchase_item_master" (
	"id" text PRIMARY KEY NOT NULL,
	"purchase_item_name" text NOT NULL,
	"parent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_equipment_relations" (
	"task_id" text NOT NULL,
	"equipment_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"usage_type" text DEFAULT 'main',
	"planned_hours" integer,
	"actual_hours" integer,
	"quantity" integer DEFAULT 1,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "task_equipment_relations_task_id_equipment_id_pk" PRIMARY KEY("task_id","equipment_id")
);
--> statement-breakpoint
CREATE TABLE "task_plan_dates" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"planned_start_date" date NOT NULL,
	"planned_end_date" date NOT NULL,
	"plan_type_name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_project_relations" (
	"task_id" text NOT NULL,
	"project_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"relation_type" text DEFAULT 'default',
	"sort_order" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "task_project_relations_task_id_project_id_pk" PRIMARY KEY("task_id","project_id")
);
--> statement-breakpoint
CREATE TABLE "task_purchase_item_relations" (
	"task_id" text NOT NULL,
	"purchase_item_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"usage_type" text DEFAULT 'material',
	"required_quantity" integer DEFAULT 1,
	"actual_quantity" integer,
	"unit_price" numeric(12, 2),
	"currency" text DEFAULT 'JPY',
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "task_purchase_item_relations_task_id_purchase_item_id_pk" PRIMARY KEY("task_id","purchase_item_id")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"task_name" text NOT NULL,
	"task_type_id" text NOT NULL,
	"plan_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_task_type_relations" (
	"task_id" text NOT NULL,
	"task_type_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"priority" text DEFAULT 'primary',
	"work_ratio" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "task_task_type_relations_task_id_task_type_id_pk" PRIMARY KEY("task_id","task_type_id")
);
--> statement-breakpoint
CREATE TABLE "task_types" (
	"id" text PRIMARY KEY NOT NULL,
	"type_name" text NOT NULL,
	"description" text,
	"color_code" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "task_types_type_name_unique" UNIQUE("type_name")
);
--> statement-breakpoint
CREATE TABLE "task_user_relations" (
	"task_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"role_type" text DEFAULT 'assignee',
	"estimated_hours" numeric(10, 2),
	"actual_hours" numeric(10, 2),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "task_user_relations_task_id_user_id_pk" PRIMARY KEY("task_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "equipment_master" ADD CONSTRAINT "equipment_master_parent_id_equipment_master_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."equipment_master"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_item_master" ADD CONSTRAINT "purchase_item_master_parent_id_purchase_item_master_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."purchase_item_master"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_equipment_relations" ADD CONSTRAINT "task_equipment_relations_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_equipment_relations" ADD CONSTRAINT "task_equipment_relations_equipment_id_equipment_master_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment_master"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_plan_dates" ADD CONSTRAINT "task_plan_dates_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_project_relations" ADD CONSTRAINT "task_project_relations_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_project_relations" ADD CONSTRAINT "task_project_relations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_purchase_item_relations" ADD CONSTRAINT "task_purchase_item_relations_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_purchase_item_relations" ADD CONSTRAINT "task_purchase_item_relations_purchase_item_id_purchase_item_master_id_fk" FOREIGN KEY ("purchase_item_id") REFERENCES "public"."purchase_item_master"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_task_type_id_task_types_id_fk" FOREIGN KEY ("task_type_id") REFERENCES "public"."task_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_plan_id_task_plan_dates_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."task_plan_dates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_task_type_relations" ADD CONSTRAINT "task_task_type_relations_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_task_type_relations" ADD CONSTRAINT "task_task_type_relations_task_type_id_task_types_id_fk" FOREIGN KEY ("task_type_id") REFERENCES "public"."task_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_user_relations" ADD CONSTRAINT "task_user_relations_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_user_relations" ADD CONSTRAINT "task_user_relations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;