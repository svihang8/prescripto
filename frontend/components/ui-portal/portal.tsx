"use client";

import { useState } from "react";
import PortalHeader from "./portal-header";
import CreatePrescription from "./create-prescription";
import PrescriptionCardList from "./prescription-card-list";


export default function Portal() {
    const [page, setPage] = useState("view")
    return (
        <>
        <PortalHeader
        setPage = {setPage}
        ></PortalHeader>
        {page == "create" && <CreatePrescription></CreatePrescription>}
        {page == "view" && <PrescriptionCardList></PrescriptionCardList>}
        </>
    );
}
