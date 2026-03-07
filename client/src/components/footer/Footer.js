import React from 'react';
import styled from 'styled-components';
import { FiCamera, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xlarge} 0 ${({ theme }) => theme.spacing.medium};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.medium};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const Section = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${({ theme }) => theme.fontSizes.large};
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }
  
  p {
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.8;
    line-height: 1.8;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  
  svg {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 1.2rem;
  }
  
  span {
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.8;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
  
  a {
    color: ${({ theme }) => theme.colors.white};
    font-size: 1.5rem;
    transition: all ${({ theme }) => theme.transitions.default};
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
      transform: translateY(-3px);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.large};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  p {
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.6;
    font-size: ${({ theme }) => theme.fontSizes.small};
    margin: 0;
  }
`;

function Footer() {
  return (
    <FooterWrapper>
      <Container>
        <Grid>
          <Section>
            <h3>Sushrut Shastri</h3>
            <p>
              Capturing life's beautiful moments through the lens. 
              Specializing in weddings, portraits, and commercial photography.
            </p>
            <SocialLinks>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                <FaPinterest />
              </a>
            </SocialLinks>
          </Section>

          <Section>
            <h3>Contact Info</h3>
            <ContactItem>
              <FiPhone />
              <span>+1 780-893-5919</span>
            </ContactItem>
            <ContactItem>
              <FiMail />
              <span>sushrutshastri@photography.com</span>
            </ContactItem>
            <ContactItem>
              <FiMapPin />
              <span>Edmonton, AB</span>
            </ContactItem>
            <ContactItem>
              <FiCamera />
              <span>@sushrutshastri</span>
            </ContactItem>
          </Section>

          <Section>
            <h3>Quick Links</h3>
            <ContactItem>
              <span>→ Wedding Photography</span>
            </ContactItem>
            <ContactItem>
              <span>→ Portrait Sessions</span>
            </ContactItem>
            <ContactItem>
              <span>→ Commercial Work</span>
            </ContactItem>
            <ContactItem>
              <span>→ Family Portraits</span>
            </ContactItem>
          </Section>
        </Grid>

        <Copyright>
          <p>
            © {new Date().getFullYear()} Sushrut Shastri Photography. 
            All rights reserved. Built with passion.
          </p>
        </Copyright>
      </Container>
    </FooterWrapper>
  );
}

export default Footer;