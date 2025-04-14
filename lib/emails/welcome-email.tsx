import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Link,
} from "@react-email/components";
import { Section } from "lucide-react";

interface WelcomeEmailProps {
  userEmail: string;
  dashboardUrl?: string;
}

export const WelcomeEmail = ({
  userEmail,
  dashboardUrl = "http://localhost:3000/dashboard",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Body style={main}>
        <Container style={container}>
          <h1 style={h1}>Welcome to our platform!</h1>
          <Text style={text}>
            Thank you for signing up, {userEmail}! We&apos;re excited to have
            you on board!
          </Text>
          <Text style={text}>
            You can now access all features of our platform.
          </Text>
          <Section style={buttonContainer}>
            <Link style={button} href={dashboardUrl}>
              Go to dashboard
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.05)",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "30px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
};

const text = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 15px",
};

const buttonContainer = {
  margin: "30px 0 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#4f46e5",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: "bold",
  padding: "12px 25px",
  textDecoration: "none",
  textAlign: "center" as const,
};
