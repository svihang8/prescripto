import Link from "next/link";
import PrescriptionCard from "./prescription-card";

export default function PrescriptionCardList() {
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-20"> {/* Flex container with gap between items */}
            {/* Repeat the same structure for other PrescriptionCard components */}
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            <PrescriptionCard></PrescriptionCard>
            {/* Add more cards as needed */}
        </div>
    );
}
