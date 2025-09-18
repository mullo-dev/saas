import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface ReviewEmailProps {
  authorName?: string;
  authorEmail?: string;
  reviewText?: string;
  href?: string
}

export default function ReviewEmail({ authorName, authorEmail, reviewText, href }: ReviewEmailProps) {
  return (
    <Html>
      <Head />

      <Body style={main}>
        <Preview>{`Vous avez reçu un mail de ${authorEmail}`}</Preview>
        <Container style={container}>
          <Section>
            <Img
              src={`https://www.mullo.fr/static/media/logo.e1708034d0419af6d434a5a0838ada0c.svg`}
              width="96"
              height="30"
              alt="Airbnb"
            />
          </Section>
          <Section style={{ paddingBottom: '20px' }}>
            <Row>
              <Text style={heading}>{authorName} vous a écrit un mot</Text>
              <Text style={review}>{reviewText}</Text>
              <Text style={paragraph}>
                Vous pouvez retrouver l'ensemble de la conversation sur votre profil
              </Text>

              <Button style={button} href={href}>
                Consulter
              </Button>
            </Row>
          </Section>

          <Hr style={hr} />
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
};

const review = {
  ...paragraph,
  padding: '24px',
  backgroundColor: '#f2f3f3',
  borderRadius: '4px',
};

const button = {
  backgroundColor: '#466e4e',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '18px',
  padding: '19px 30px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};
