/** biome-ignore-all lint/suspicious/noExplicitAny: API error payload and mutation variables are not typed in the current hooks. */
/** biome-ignore-all lint/style/noNonNullAssertion: Expertise is checked before accessing its entries. */
"use client";

import { toast } from "sonner";
import {
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiFileText,
  FiX,
} from "react-icons/fi";

import { useApproveTechnician, useGetAllTechnician } from "@/hooks";
import { type Technician, TechnicianProfileStatus } from "@/types";

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
import { Button } from "@/components/ui/button";
import MyOutagesSkleton from "@/components/loader/skleton-loading/dashboard/my-outages.skleton";
import EmptyText from "@/components/layout/shared/empty-text/EmptyText";
import { getAvailabilityClassName, getVerificationClassName, getVerificationLabel, headClass } from "@/lib/technician.libs";

const renderResume = (resume?: string | null) => {
  if (!resume) {
    return <span className="text-xs text-muted-foreground">Not provided</span>;
  }

  return (
    <a
      href={resume}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border border-primary/20 bg-primary/5 px-2.5 text-xs font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <FiFileText aria-hidden="true" className="size-3.5" />
      View resume
      <FiExternalLink aria-hidden="true" className="size-3 opacity-70" />
    </a>
  );
};

const ManageTechnician = () => {
  const { data: technician, isPending: technicianPending } =
    useGetAllTechnician();

  const {
    mutate: approveTechnician,
    isPending: approving,
    variables,
  } = useApproveTechnician();

  const technicians: Technician[] = technician?.data ?? [];

  const handleUpdateStatus = (
    technicianId: string,
    status: TechnicianProfileStatus,
  ) => {
    const payload = {
      technicianId,
      status,
    };

    approveTechnician(payload, {
      onSuccess: () => {
        toast.success(
          status === TechnicianProfileStatus.APPROVED
            ? "Technician approved successfully."
            : "Technician rejected.",
        );
      },
      onError: (error: any) => {
        toast.error(
          error?.data?.message ||
          error?.message ||
          `Failed to ${status === TechnicianProfileStatus.APPROVED
            ? "approve"
            : "reject"
          } technician.`,
        );
      },
    });
  };


  const renderAction = (item: Technician, compact = false) => {
    const verificationStatus =
      item.technicianProfile?.technicianvProfileVerificationStatus;
  
    if (verificationStatus === TechnicianProfileStatus.APPROVED) {
      return (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <FiCheckCircle className="size-3.5 text-green-600" />
          Approved
        </span>
      );
    }

    const isThisRowPending =
      approving &&
      ((variables as any)?.technicianId === item.id ||
        (variables as any)?.technicianId === item.technicianProfile?.id);
    const isApprovingThisRow =
      isThisRowPending &&
      (variables as any)?.status === TechnicianProfileStatus.APPROVED;
    const isRejectingThisRow =
      isThisRowPending &&
      (variables as any)?.status === TechnicianProfileStatus.REJECTED;
    const height = compact ? "h-8" : "h-9";

    return (
      <>
        <Button
          type="button"
          size="sm"
          disabled={isThisRowPending}
          onClick={() =>
            handleUpdateStatus(item?.technicianProfile?.id as string, TechnicianProfileStatus.APPROVED)
          }
          className={`${height} gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer disabled:cursor-not-allowed`}
        >
          <FiCheckCircle className="size-3.5" />
          {isApprovingThisRow ? "Approving..." : "Approve"}
        </Button>

        {verificationStatus !== TechnicianProfileStatus.REJECTED && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isThisRowPending}
            onClick={() =>
              handleUpdateStatus(item?.technicianProfile?.id as string, TechnicianProfileStatus.REJECTED)
            }
            className={`${height} gap-1.5 rounded-lg border-red-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30 cursor-pointer disabled:cursor-not-allowed`}
          >
            <FiX className="size-3.5" />
            {isRejectingThisRow ? "Rejecting..." : "Reject"}
          </Button>
        )}
      </>
    );
  };

  if (technicianPending) {
    return <MyOutagesSkleton />;
  }

  if (technicians.length === 0) {
    return (
      <EmptyText title="No Technicians Found" description="  No technician accounts have been registered yet." />
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
                  <TableHead className={`${headClass} pl-6`}>
                    Technician
                  </TableHead>
                  <TableHead className={headClass}>Expertise</TableHead>
                  <TableHead className={headClass}>Experience</TableHead>
                  <TableHead className={headClass}>Resume</TableHead>
                  <TableHead className={headClass}>Availability</TableHead>
                  <TableHead className={headClass}>Assigned Outages</TableHead>
                  <TableHead className={headClass}>Verification</TableHead>
                  <TableHead className={`${headClass} pr-6 text-right`}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {technicians.map((item, index) => {
                  const verificationStatus =
                    item.technicianProfile
                      ?.technicianvProfileVerificationStatus;
                  const cellBorder =
                    index !== technicians.length - 1
                      ? "border-b border-border"
                      : "";

                  return (
                    <TableRow
                      key={item.id}
                      className="group border-0 transition-colors hover:bg-muted/30"
                    >
                      {/* Technician */}
                      <TableCell className={`pl-6 ${cellBorder}`}>
                        <div className="min-w-0 max-w-44">
                          <p className="truncate font-semibold text-card-foreground">
                            {item.name}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {item.email}
                          </p>
                        </div>
                      </TableCell>

                      {/* Expertise */}
                      <TableCell className={cellBorder}>
                        <div className="flex max-w-56 flex-wrap gap-1">
                          {(item.technicianProfile?.expertise ?? [])
                            .slice(0, 2)
                            .map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-[10px] font-normal text-muted-foreground"
                              >
                                {skill}
                              </Badge>
                            ))}
                          {(item.technicianProfile?.expertise?.length ?? 0) >
                            2 && (
                              <Badge
                                variant="outline"
                                className="text-[10px] font-normal text-muted-foreground"
                              >
                                +{item.technicianProfile!.expertise!.length - 2}
                              </Badge>
                            )}
                        </div>
                      </TableCell>

                      {/* Experience */}
                      <TableCell
                        className={`whitespace-nowrap text-sm text-card-foreground ${cellBorder}`}
                      >
                        {item.technicianProfile?.experience ?? 0} yr
                      </TableCell>

                      {/* Resume */}
                      <TableCell className={cellBorder}>
                        {renderResume(item.technicianProfile?.resume)}
                      </TableCell>

                      {/* Availability */}
                      <TableCell className={cellBorder}>
                        <Badge
                          variant="outline"
                          className={getAvailabilityClassName(
                            item.technicianProfile?.availability,
                          )}
                        >
                          {item.technicianProfile?.availability ?? "N/A"}
                        </Badge>
                      </TableCell>

                      {/* Assigned Outages */}
                      <TableCell
                        className={`whitespace-nowrap text-sm text-card-foreground ${cellBorder}`}
                      >
                        {item.assignedOutages?.length ?? 0}
                      </TableCell>

                      {/* Verification */}
                      <TableCell className={cellBorder}>
                        <Badge
                          variant="outline"
                          className={getVerificationClassName(
                            verificationStatus,
                          )}
                        >
                          {getVerificationLabel(verificationStatus)}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className={`pr-6 ${cellBorder}`}>
                        <div className="flex items-center justify-end gap-1.5">
                          {renderAction(item)}
                        </div>
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
        {technicians.map((item) => {
          const verificationStatus =
            item.technicianProfile?.technicianvProfileVerificationStatus;

          return (
            <Card
              key={item.id}
              className="rounded-xl border-border bg-card shadow-sm transition-colors hover:bg-muted/20"
            >
              {/* sm and up */}
              <CardContent className="hidden px-4 py-3 sm:block sm:px-5 sm:py-3.5">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {/* Technician */}
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-card-foreground sm:text-base">
                        {item.name}
                      </p>

                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[10px] font-semibold ${getVerificationClassName(
                          verificationStatus,
                        )}`}
                      >
                        {getVerificationLabel(verificationStatus)}
                      </Badge>
                    </div>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {item.email}
                    </p>
                  </div>

                  {/* Availability */}
                  <Badge
                    variant="outline"
                    className={`hidden shrink-0 md:inline-flex ${getAvailabilityClassName(
                      item.technicianProfile?.availability,
                    )}`}
                  >
                    {item.technicianProfile?.availability ?? "N/A"}
                  </Badge>

                  {/* Experience + Assigned */}
                  <div className="hidden shrink-0 items-center gap-4 text-xs text-muted-foreground md:flex">
                    <div className="flex items-center gap-1">
                      <FiClock className="size-3.5" />
                      <span>{item.technicianProfile?.experience ?? 0} yr</span>
                    </div>

                    <span>{item.assignedOutages?.length ?? 0} assigned</span>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    {renderAction(item)}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-2.5">
                  <span className="text-xs text-muted-foreground">Resume</span>
                  {renderResume(item.technicianProfile?.resume)}
                </div>
              </CardContent>

              {/* below sm */}
              <CardContent className="px-4 py-3 sm:hidden">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-card-foreground">
                      {item.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {item.email}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`shrink-0 whitespace-nowrap text-[10px] font-semibold ${getVerificationClassName(
                      verificationStatus,
                    )}`}
                  >
                    {getVerificationLabel(verificationStatus)}
                  </Badge>
                </div>

                {(item.technicianProfile?.expertise?.length ?? 0) > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.technicianProfile!.expertise!.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-[10px] font-normal text-muted-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-2.5">
                  <span className="text-xs text-muted-foreground">Resume</span>
                  {renderResume(item.technicianProfile?.resume)}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${getAvailabilityClassName(
                        item.technicianProfile?.availability,
                      )}`}
                    >
                      {item.technicianProfile?.availability ?? "N/A"}
                    </Badge>

                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <FiClock className="size-3" />
                      {item.technicianProfile?.experience ?? 0} yr
                    </span>

                    <span className="text-[11px] text-muted-foreground">
                      {item.assignedOutages?.length ?? 0} assigned
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {renderAction(item, true)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default ManageTechnician;