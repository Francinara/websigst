export default function TextCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  const paragraphs = text.split("\n");

  return (
    <div className="p-3 bg-white rounded-lg border">
      <h2 className="text-base font-semibold text-gray-600">{title}</h2>
      {paragraphs.map((para, index) => (
        <p key={index} className="text-xs">
          {para}
        </p>
      ))}
    </div>
  );
}
