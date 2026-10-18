"use client";

import { useGetMyOutages, useGetPaymentRecords } from "@/hooks";
import { PaginationUi } from "@/components/layout/shared/pagination-ui/PaginationUi";
import { useUrlListState } from "@/hooks/use-url-list-state.hook";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { IMyOutage } from "@/types";
import PriorityInfoModal from "@/components/modal/priority-info.modal";
import UpdateOutageModal from "@/components/modal/update-my-outage.modal";
import DeleteMyOutageConfirmModal from "@/components/modal/delete-my-outage.modal";
import MyOutagesSkleton from "@/components/loader/skleton-loading/dashboard/my-outages.skleton";
import { getPriorityClassName, getStatusClassName } from "@/lib/utils";
import EmptyText from "@/components/layout/shared/empty-text/EmptyText";

const MyOutages = () => {
  const { page, limit, updateQuery } = useUrlListState();
  const { data: myOutages, isPending } = useGetMyOutages({ page, limit });
  const {data:payments,isPending:paymentPending} = useGetPaymentRecords()

  const outages = myOutages?.data?.data ?? myOutages?.data ?? [];
  const meta = myOutages?.data?.meta ?? myOutages?.meta;
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };


console.log(outages,"This is all outages this")

  if (isPending) {
    return <MyOutagesSkleton />;
  }

  if (outages.length === 0) {
    return (
      <EmptyText title="  No Outages Reported" description="   You have not reported any power outages yet." />
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Desktop Table */}
      <div className="hidden xl:block">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <Table className="border-separate border-spacing-0">
              <TableHeader>
                <TableRow className="hover:bg-transparent font-inter">
                  <TableHead className="h-12 whitespace-nowrap border-b border-border bg-muted/40 pl-6 font-semibold text-foreground">
                    Cause
                  </TableHead>

                  <TableHead className="h-12 whitespace-nowrap border-b border-border bg-muted/40 font-semibold text-foreground">
                    Area
                  </TableHead>

                  <TableHead className="h-12 whitespace-nowrap border-b border-border bg-muted/40 font-semibold text-foreground">
                    Priority
                  </TableHead>

                  <TableHead className="h-12 whitespace-nowrap border-b border-border bg-muted/40 font-semibold text-foreground">
                    Status
                  </TableHead>

                  <TableHead className="h-12 whitespace-nowrap border-b border-border bg-muted/40 font-semibold text-foreground">
                    Reported At
                  </TableHead>

                  <TableHead className="h-12 whitespace-nowrap border-b border-border bg-muted/40 pr-6 text-right font-semibold text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {outages.map((outage: IMyOutage, index: number) => {
                  const cellBorder =
                    index !== outages.length - 1
                      ? "border-b border-border"
                      : "";

                  return (
                    <TableRow
                      key={outage.id}
                      className="group border-0 transition-colors hover:bg-muted/30"
                    >
                      {/* Cause */}
                      <TableCell className={`pl-6 ${cellBorder}`}>
                        <div className="max-w-52">
                          <p className="truncate font-semibold text-card-foreground">
                            {outage.cause}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            #{outage.id.slice(0, 8)}
                          </p>
                        </div>
                      </TableCell>

                      {/* Area */}
                      <TableCell className={cellBorder}>
                        <p className="max-w-44 truncate font-medium text-card-foreground">
                          {outage.area?.name ?? "N/A"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {outage.area?.code ?? "N/A"}
                        </p>
                      </TableCell>

                      {/* Priority */}
                      <TableCell className={cellBorder}>
                        <Badge
                          variant="outline"
                          className={getPriorityClassName(outage.priority)}
                        >
                          {outage.priority}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell className={cellBorder}>
                        <Badge
                          variant="outline"
                          className={getStatusClassName(outage.status)}
                        >
                          {outage.status.replace("_", " ")}
                        </Badge>
                      </TableCell>

                      {/* Reported At */}
                      <TableCell
                        className={`whitespace-nowrap text-sm text-muted-foreground ${cellBorder}`}
                      >
                        {formatDate(outage.reported_At)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className={`pr-6 ${cellBorder}`}>
                        {outage.status === "RESTORED" ? (
                          <p className="text-right text-sm font-medium text-green-700 dark:text-green-400">
                            Congratulations! Power has been restored.
                          </p>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {outage.priority === "NORMAL" && (
                              <PriorityInfoModal outageId={outage.id} />
                            )}

                            <UpdateOutageModal outage={outage} />
                            {outage.status === "REPORTED" && (
                              <DeleteMyOutageConfirmModal outageId={outage.id} />
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-3 xl:hidden">
        {outages.map((outage: IMyOutage) => (
          <Card
            key={outage.id}
            className="rounded-xl border-border bg-card shadow-sm transition-colors hover:bg-muted/20"
          >
            <CardContent className="hidden px-4 py-3 sm:block sm:px-5 sm:py-3.5">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Cause + Area */}
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-card-foreground sm:text-base">
                      {outage.cause}
                    </p>

                    <span className="hidden shrink-0 text-xs text-muted-foreground md:inline">
                      #{outage.id.slice(0, 8)}
                    </span>

                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] font-semibold ${getStatusClassName(
                        outage.status
                      )}`}
                    >
                      {outage.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {outage.area?.name ?? "N/A"}
                    {outage.area?.code && (
                      <span className="hidden md:inline">
                        {" "}
                        &middot; {outage.area.code}
                      </span>
                    )}
                  </p>
                </div>

                {/* Priority */}
                <Badge
                  variant="outline"
                  className={`hidden shrink-0 md:inline-flex ${getPriorityClassName(
                    outage.priority
                  )}`}
                >
                  {outage.priority}
                </Badge>

                {/* Reported */}
                <div className="hidden shrink-0 lg:block">
                  <p className="text-[11px] text-muted-foreground">Reported</p>

                  <p className="text-xs font-medium text-card-foreground">
                    {formatDate(outage.reported_At)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {outage.status === "RESTORED" ? (
                    <p className="text-right text-sm font-medium text-green-700 dark:text-green-400">
                      Congratulations! Power has been restored.
                    </p>
                  ) : (
                    <>
                      {outage.priority === "NORMAL" && (
                        <PriorityInfoModal outageId={outage.id} />
                      )}

                      <UpdateOutageModal outage={outage} />

                      {outage.status === "REPORTED" && (
                        <DeleteMyOutageConfirmModal outageId={outage.id} />
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>

            <CardContent className="px-4 py-3 sm:hidden">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-card-foreground">
                      {outage.cause}
                    </p>

                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      #{outage.id.slice(0, 8)}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {outage.area?.name ?? "N/A"}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={`shrink-0 whitespace-nowrap text-[10px] font-semibold ${getStatusClassName(
                    outage.status
                  )}`}
                >
                  {outage.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${getPriorityClassName(
                      outage.priority
                    )}`}
                  >
                    {outage.priority}
                  </Badge>

                  <span className="text-[11px] text-muted-foreground">
                    {formatDate(outage.reported_At)}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {outage.status === "RESTORED" ? (
                    <p className="text-right text-sm font-medium text-green-700 dark:text-green-400">
                      Congratulations! Power has been restored.
                    </p>
                  ) : (
                    <>
                      {outage.priority === "NORMAL" && (
                        <PriorityInfoModal outageId={outage.id} />
                      )}

                      <UpdateOutageModal outage={outage} />

                      <DeleteMyOutageConfirmModal outageId={outage.id} />
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {outages.length > 0 && (
        <div className="w-full min-w-0 border-t border-border/60 pt-5 sm:pt-6">
          <PaginationUi
            currentPage={meta?.page ?? page}
            itemsPerPage={meta?.limit ?? limit}
            totalItems={meta?.total ?? outages.length}
            totalPages={meta?.totalPages ?? 1}
            onPageChange={(value) => updateQuery({ page: value }, "push")}
            onItemsPerPageChange={(value) => {
              updateQuery({ limit: value, page: 1 });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MyOutages;
