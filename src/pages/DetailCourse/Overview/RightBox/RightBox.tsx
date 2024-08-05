import { BoxListDocuments, Course } from '@auxo-dev/frontend-common';

export default function RightBox({ data }: { data: Course }) {
    return <BoxListDocuments documents={data.documents} members={data.member} />;
}
