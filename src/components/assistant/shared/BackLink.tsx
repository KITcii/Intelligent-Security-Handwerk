"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const BackLink = ({ text }: { text: string }) => {
  const router = useRouter();
  return (
    <Link href="" onClick={() => router.back()} className="inline-link">
      <i className="material-symbols-outlined md-s inline-block align-middle me-1">
        arrow_back
      </i>
      <span className="inline-block align-middle inline-link">{text}</span>
    </Link>
  );
};

export default BackLink;
