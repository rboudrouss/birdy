// import styles from "./page.module.css";

export default function postId({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>got ID ${params.id}</h1>
    </main>
  );
}
