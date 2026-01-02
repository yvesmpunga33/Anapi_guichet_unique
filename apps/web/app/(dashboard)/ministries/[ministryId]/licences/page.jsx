"use client";

import { use } from "react";
import RequestsList from "../../../../../components/ministry/RequestsList";

export default function LicencesPage({ params }) {
  const resolvedParams = use(params);
  const { ministryId } = resolvedParams;

  return (
    <RequestsList
      ministryId={ministryId}
      requestType="LICENCE"
      title="Licences"
      description="Gestion des demandes de licence"
      gradient="from-purple-500 to-purple-600"
    />
  );
}
