-- CreateTable
CREATE TABLE "TestParent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TestChild" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    CONSTRAINT "TestChild_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "TestParent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
