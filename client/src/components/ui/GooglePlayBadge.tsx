interface Props {
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

const GooglePlayBadge = ({ className }: Props) => {
  return (
    <div className={className}>
      <a
        href="https://play.google.com/store/apps/details?id=com.shalev.shoppinglistmobile"
        target="blank"
      >
        <img
          className="h-12 m-auto"
          alt="להורדה ב-Google Play"
          src="/images/GetItOnGooglePlay_Hebrew.png"
        />
      </a>
    </div>
  );
};

export default GooglePlayBadge;
