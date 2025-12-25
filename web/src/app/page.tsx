import { EPage } from '@models';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect(EPage.Cards);
}
