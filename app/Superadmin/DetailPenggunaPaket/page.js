export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import DetailPenggunaPaket from "./DetailContent"; // kamu bikin file baru di folder yang sama

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailPenggunaPaket />
    </Suspense>
  );
}
