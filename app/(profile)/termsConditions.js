import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For back arrow icon
import { useRouter } from "expo-router";

export default function TermsConditions() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.heading}>Terms and Conditions</Text>
        <Text style={styles.sectionTitle}>
          Effective Date: 20th January, 2025
        </Text>

        <Text style={styles.sectionTitle}>1. Our Services</Text>
        <Text style={styles.text}>
          Our platform provides a variety of digital services aimed at enhancing
          user experience. We reserve the right to modify, update, or
          discontinue any aspect of our services at any time without prior
          notice. By using our platform, you acknowledge and accept the terms
          outlined here, which govern your use of our services.
        </Text>

        <Text style={styles.sectionTitle}>2. Intellectual Property Rights</Text>
        <Text style={styles.text}>
          All content, trademarks, logos, and materials available on this
          platform, including but not limited to text, graphics, software,
          designs, and code, are owned by or licensed to us. Any unauthorized
          use, reproduction, or distribution of these materials is strictly
          prohibited. Violation of these rights may result in civil or criminal
          penalties.
        </Text>

        <Text style={styles.sectionTitle}>3. User Representations</Text>
        <Text style={styles.text}>
          By using our services, you confirm that:
          {"\n"}- You are at least 13 years old or, if under the age of
          majority, have obtained the consent of a parent or legal guardian to
          use the platform.
          {"\n"}- You have the legal capacity to agree to these terms.
          {"\n"}- All information you provide to us is accurate and up to date.
          {"\n"}- You will comply with all applicable laws and regulations while
          using the platform.
        </Text>

        <Text style={styles.sectionTitle}>4. User Registration</Text>
        <Text style={styles.text}>
          To access certain features of our platform, you may be required to
          register an account. You agree to:
          {"\n"}- Provide accurate and complete registration information.
          {"\n"}- Maintain the confidentiality of your login credentials.
          {"\n"}- Notify us immediately of any unauthorized access or security
          breach involving your account.
          {"\n"}- Be fully responsible for all activities conducted under your
          account.
        </Text>

        <Text style={styles.sectionTitle}>5. Purchases and Payment</Text>
        <Text style={styles.text}>
          When making purchases on our platform:
          {"\n"}- Payments must be made using valid and authorized payment
          methods.
          {"\n"}- All sales are considered final unless explicitly stated
          otherwise.
          {"\n"}- You agree to pay any applicable taxes and fees associated with
          your purchase.
          {"\n"}- In case of disputes, you must contact our support team for
          resolution.
        </Text>

        <Text style={styles.sectionTitle}>6. Software</Text>
        <Text style={styles.text}>
          The software provided through our platform is licensed for your
          personal, non-commercial use. You agree not to:
          {"\n"}- Modify, copy, or create derivative works based on the
          software.
          {"\n"}- Reverse-engineer, decompile, or attempt to extract source
          code.
          {"\n"}- Use the software for illegal or unauthorized purposes.
        </Text>

        <Text style={styles.sectionTitle}>7. Prohibited Activities</Text>
        <Text style={styles.text}>
          Users are strictly prohibited from engaging in activities that:
          {"\n"}- Violate any applicable local, state, national, or
          international law.
          {"\n"}- Involve unauthorized access to our systems or data.
          {"\n"}- Introduce malicious software or harmful code.
          {"\n"}- Interfere with or disrupt the functionality of the platform.
          {"\n"}- Exploit the platform for any fraudulent or unethical purpose.
        </Text>

        <Text style={styles.sectionTitle}>8. User-Generated Contributions</Text>
        <Text style={styles.text}>
          You retain ownership of any content you post on our platform. However,
          by posting or submitting content, you grant us a non-exclusive,
          royalty-free license to use, modify, reproduce, and distribute the
          content for purposes related to our services. You are solely
          responsible for ensuring that your contributions do not infringe on
          third-party rights or violate applicable laws.
        </Text>

        <Text style={styles.sectionTitle}>9. Contribution License</Text>
        <Text style={styles.text}>
          By submitting content, you grant us:
          {"\n"}- The right to use your contributions in promotional,
          operational, and developmental contexts.
          {"\n"}- Permission to edit or remove content that violates these terms
          or is deemed inappropriate.
          {"\n"}- Waiver of any claims or moral rights associated with your
          submitted content.
        </Text>

        <Text style={styles.sectionTitle}>10. Guidelines for Reviews</Text>
        <Text style={styles.text}>
          To ensure the quality and credibility of reviews on our platform, you
          agree to:
          {"\n"}- Provide honest and fact-based feedback based on your personal
          experiences.
          {"\n"}- Avoid defamatory, offensive, or misleading statements in
          reviews.
          {"\n"}- Follow any specific guidelines outlined for submitting
          reviews.
        </Text>

        <Text style={styles.sectionTitle}>11. Mobile Application License</Text>
        <Text style={styles.text}>
          Subject to compliance with these terms, we grant you a limited,
          non-transferable license to download and use our mobile application
          for personal purposes. The application must not be used for commercial
          exploitation or any illegal activities.
        </Text>

        <Text style={styles.sectionTitle}>
          12. Third-Party Websites and Content
        </Text>
        <Text style={styles.text}>
          Our platform may include links to third-party websites or display
          content from external sources. We are not responsible for:
          {"\n"}- The accuracy, reliability, or legality of third-party content.
          {"\n"}- Any damages or losses arising from interactions with
          third-party platforms.
          {"\n"}- The terms and conditions of third-party websites, which you
          should review independently.
        </Text>

        <Text style={styles.sectionTitle}>13. Services Management</Text>
        <Text style={styles.text}>
          We reserve the right to manage and oversee all aspects of our services
          to ensure their integrity and security. This includes:
          {"\n"}- Monitoring user activity for compliance with these terms.
          {"\n"}- Restricting or terminating access for users found in violation
          of policies.
          {"\n"}- Implementing measures to prevent unauthorized use or abuse of
          our services.
        </Text>

        <Text style={styles.sectionTitle}>14. Term and Termination</Text>
        <Text style={styles.text}>
          These terms remain effective while you use our services. We may
          terminate or suspend your access at our discretion without prior
          notice if:
          {"\n"}- You breach any provision of these terms.
          {"\n"}- Your actions jeopardize the security or functionality of our
          platform.
          {"\n"}- Required by law or regulatory authorities.
        </Text>

        <Text style={styles.sectionTitle}>
          15. Modifications and Interruptions
        </Text>
        <Text style={styles.text}>
          We may modify, update, or discontinue services at any time without
          prior notice. While we strive to ensure uninterrupted access, we are
          not liable for any service interruptions, delays, or resulting losses.
        </Text>

        <Text style={styles.sectionTitle}>16. Governing Law</Text>
        <Text style={styles.text}>
          These terms are governed by and construed in accordance with the laws
          of [Insert Jurisdiction]. Any disputes will be resolved under the
          jurisdiction of the courts in this area, subject to applicable
          arbitration clauses if agreed upon.
        </Text>

        <Text style={styles.sectionTitle}>17. Corrections</Text>
        <Text style={styles.text}>
          We reserve the right to correct any errors, inaccuracies, or omissions
          found in content, descriptions, or pricing information. Corrections
          will be made without prior notice and apply retroactively where
          applicable.
        </Text>

        <Text style={styles.sectionTitle}>18. Disclaimer</Text>
        <Text style={styles.text}>
          Our platform and services are provided "as is" and "as available"
          without warranties of any kind, either express or implied. We do not
          guarantee:
          {"\n"}- The accuracy or reliability of information provided.
          {"\n"}- Continuous, error-free operation of the platform.
          {"\n"}- That the platform will meet your expectations or requirements.
        </Text>

        <Text style={styles.sectionTitle}>19. Limitations of Liability</Text>
        <Text style={styles.text}>
          To the fullest extent permitted by law, we are not liable for:
          {"\n"}- Any indirect, incidental, or consequential damages arising
          from the use of our services.
          {"\n"}- Loss of data, profits, or business opportunities.
          {"\n"}- Unauthorized access to or alteration of your account or data.
        </Text>

        <Text style={styles.sectionTitle}>20. Indemnification</Text>
        <Text style={styles.text}>
          You agree to indemnify and hold us harmless from any claims, damages,
          or expenses arising out of:
          {"\n"}- Your breach of these terms.
          {"\n"}- Your misuse of the platform.
          {"\n"}- Violations of third-party rights or applicable laws.
        </Text>

        <Text style={styles.sectionTitle}>21. User Data</Text>
        <Text style={styles.text}>
          We handle user data in accordance with our Privacy Policy. You are
          responsible for:
          {"\n"}- Ensuring the accuracy of personal information submitted to our
          platform.
          {"\n"}- Securing your account and safeguarding your login credentials.
        </Text>

        <Text style={styles.sectionTitle}>22. Electronic Communications</Text>
        <Text style={styles.text}>
          By using our platform, you consent to receive electronic
          communications from us. These communications may include updates,
          promotional offers, or service announcements. You may opt-out of
          non-essential communications by following the provided instructions.
        </Text>

        <Text style={styles.sectionTitle}>23. Miscellaneous</Text>
        <Text style={styles.text}>
          These terms constitute the entire agreement between you and us
          regarding the use of our platform. If any provision of these terms is
          deemed unenforceable, the remaining provisions will continue in full
          effect. Failure to enforce any right or provision does not constitute
          a waiver of such rights.
        </Text>

        <Text style={styles.sectionTitle}>24. Cancellation Policy</Text>
        <Text style={styles.text}>
          You may request the cancellation of your account by contacting our
          support team. Refunds for paid services, if applicable, will be
          processed in accordance with our refund policy, which is outlined at
          the time of purchase.
        </Text>

        <Text style={styles.sectionTitle}>25. Quality Assurance</Text>
        <Text style={styles.text}>
          We are committed to delivering high-quality services. If you encounter
          any issues or have feedback, please reach out to our support team. We
          will make reasonable efforts to address and resolve your concerns
          promptly.
        </Text>

        <Text style={styles.sectionTitle}>26. Contact Us</Text>
        <Text style={styles.text}>
          For any questions, concerns, or feedback, you can contact us via:
          {"\n"}- Email: support@canteen.com
          {"\n"}- Address: IIT Kharagpur, Kharagpur, West
          Bengal
        </Text>

        <Text style={styles.sectionTitle}>27. Shipping Policy</Text>
        <Text style={styles.text}>
          If shipping services are applicable, details will be provided at the
          time of purchase. Delivery timelines and terms are subject to
          logistical factors and geographic location. Please refer to
          product-specific shipping guidelines for more information.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  scrollView: {
    marginVertical: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
});
