-- CreateTable
CREATE TABLE "kpi_records" (
    "id" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "value" DOUBLE PRECISION NOT NULL,
    "trendPop" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trendYoY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "chartData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpi_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_metrics" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "parentChannelId" TEXT,
    "channelName" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "newUsers" INTEGER NOT NULL,
    "spend" DOUBLE PRECISION NOT NULL,
    "signupCAC" DOUBLE PRECISION NOT NULL,
    "kycCAC" DOUBLE PRECISION NOT NULL,
    "ftdCAC" DOUBLE PRECISION NOT NULL,
    "fttCAC" DOUBLE PRECISION NOT NULL,
    "roi" DOUBLE PRECISION NOT NULL,
    "ltv" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_records" (
    "id" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "stepTitle" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "users" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funnel_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_review_records" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "downloads" INTEGER NOT NULL,
    "reviews" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "compAppName" TEXT,
    "compDownloads" INTEGER,
    "compReviews" INTEGER,
    "compScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_review_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reputation_points" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "sentimentX" DOUBLE PRECISION NOT NULL,
    "influenceY" DOUBLE PRECISION NOT NULL,
    "volumeZ" DOUBLE PRECISION NOT NULL,
    "sentiment" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    "suggestedAction" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reputation_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_node_statuses" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "countryFlag" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latency" INTEGER NOT NULL,
    "jitter" TEXT NOT NULL,
    "packetLoss" TEXT NOT NULL,
    "iosStatus" TEXT NOT NULL,
    "androidStatus" TEXT NOT NULL,
    "iosDesc" TEXT,
    "androidDesc" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_node_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_intelligence_records" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_intelligence_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_records" (
    "id" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "suggestedAction" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_roi_records" (
    "id" TEXT NOT NULL,
    "weekLabel" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'GLOBAL',
    "spend" DOUBLE PRECISION NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "roi" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_roi_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kpi_records_metricType_date_region_idx" ON "kpi_records"("metricType", "date", "region");

-- CreateIndex
CREATE INDEX "channel_metrics_channelId_date_region_idx" ON "channel_metrics"("channelId", "date", "region");

-- CreateIndex
CREATE INDEX "funnel_records_date_region_idx" ON "funnel_records"("date", "region");

-- CreateIndex
CREATE INDEX "app_review_records_platform_date_region_idx" ON "app_review_records"("platform", "date", "region");

-- CreateIndex
CREATE INDEX "reputation_points_date_region_sentiment_idx" ON "reputation_points"("date", "region", "sentiment");

-- CreateIndex
CREATE INDEX "health_node_statuses_nodeId_recordedAt_idx" ON "health_node_statuses"("nodeId", "recordedAt");

-- CreateIndex
CREATE INDEX "market_intelligence_records_type_date_region_idx" ON "market_intelligence_records"("type", "date", "region");

-- CreateIndex
CREATE INDEX "alert_records_alertType_createdAt_idx" ON "alert_records"("alertType", "createdAt");

-- CreateIndex
CREATE INDEX "marketing_roi_records_date_region_idx" ON "marketing_roi_records"("date", "region");
