-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "name" TEXT,
    "scope" TEXT,
    "external_id" TEXT,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthToken" (
    "id" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "token_type" TEXT,
    "expiry_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_user_id_provider_external_id_key" ON "Platform"("user_id", "provider", "external_id");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken_platform_id_key" ON "OAuthToken"("platform_id");

-- AddForeignKey
ALTER TABLE "Platform" ADD CONSTRAINT "Platform_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthToken" ADD CONSTRAINT "OAuthToken_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;
