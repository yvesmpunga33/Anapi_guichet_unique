"use client";

import { use } from "react";
import RequestsList from "../../../../../components/ministry/RequestsList";

export default function PermisPage({ params }) {
  const resolvedParams = use(params);
  const { ministryId } = resolvedParams;

  return (
    <RequestsList
      ministryId={ministryId}
      requestType="PERMIS"
      title="Permis"
      description="Gestion des demandes de permis"
      gradient="from-orange-500 to-orange-600"
    />
  );
}
