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

interface NewOrderEmailProps {
  client?: string;
  products?: {
    id: string;
    name: string | null;
    ref: string | null;
    quantity: number;
    priceHt: number;
    tva: number;
  }[];
  href?: string,
  message?: string,
  deliveryMethod?: string,
  address?: string,
}

export default function NewOrderEmail({ client, products, href, message, deliveryMethod, address }: NewOrderEmailProps) {
  return (
    <Html>
      <Head />

      <Body style={main}>
        <Preview>{`Nouvelle commande de ${client}`}</Preview>
        <Container style={container}>
          <Section>
            <Img
              src={`https://www.mullo.fr/logo.svg`}
              width="96"
              height="30"
              alt="Mullo"
            />
          </Section>
          <Section style={{ paddingBottom: '20px' }}>
            <Row>
              <Text style={heading}>{client} a effectué une nouvelle commande</Text>
              <Text style={paragraph}>
                Adresse : {address} <br/>
                Méthode de livraison : {deliveryMethod}
              </Text>
              <Text style={paragraph}>
                {message}
              </Text>
              <Text style={review}>
                <ul style={listContent}>
                  {products?.map((p:{name:string | null,quantity:number}, index:number) => (
                    <li key={index} style={list}>
                      <p>{p.name}</p>
                      <p>{p.quantity}</p>
                    </li>
                  ))}
                </ul>
              </Text>
              <Text style={paragraph}>
                A préparer
              </Text>
              {/* <Text style={paragraph}>
                Vous pouvez retrouver la commande sur votre profil ou en créé un pour y stocker les prochaines commandes.
              </Text>

              <Button style={button} href={href}>
                Consulter la commande ou créer un compte
              </Button> */}
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

const list = {
  display: 'flex',
  justifyContent: 'space-between'
}

const listContent = {
  listStyleType: 'disc'
}

const button = {
  backgroundColor: '#ff5a5f',
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
