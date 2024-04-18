import ProfileComponent from "./ProfileComponent";

export default function Home() {
  const userProfile = {
    pictureUrl: 'https://example.com/picture.jpg',
    displayName: 'John Doe',
  };
  return (
    <div>
      <h1>Home</h1>
      <ProfileComponent>
      </ProfileComponent>
    </div>
  );
}