"use client";

import { use } from "react";
import RequestsList from "../../../../../components/ministry/RequestsList";

export default function AutorisationsPage({ params }) {
  const resolvedParams = use(params);
  const { ministryId } = resolvedParams;

  return (
    <RequestsList
      ministryId={ministryId}
      requestType="AUTORISATION"
      title="Autorisations"
      description="Gestion des demandes d'autorisation"
      gradient="from-blue-500 to-blue-600"
    />
  );
}
