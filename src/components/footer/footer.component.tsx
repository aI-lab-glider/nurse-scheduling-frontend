/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import * as S from "./footer.styled";
import { latestAppVersion } from "../../api/latest-github-version";
import { t } from "../../helpers/translations.helper";
import GliderLogo from "../../assets/images/svg-components/GliderLogo";
import { colors } from "../../assets/css-consts";

export function Footer(): JSX.Element {
  const [latestVersion, setLatestVersion] = useState("");
  useEffect(() => {
    const awaitVersion = async (): Promise<void> => {
      const version = await latestAppVersion;
      setLatestVersion(version);
    };
    awaitVersion();
  }, []);

  const theme = useTheme();

  return (
    <S.Container>
      <S.Part style={{ justifyContent: "flex-start" }}>
        <p style={{ ...theme.FontStyles.roboto.Regular12px, marginLeft: "16px" }}>
          {latestVersion && `${t("version")}: ${latestVersion}`}
        </p>
      </S.Part>
      <S.Part>
        <S.LinkWrapper
          href="http://www.glider.agh.edu.pl/" //nosonar
          target="_blank"
          rel="noopener noreferrer"
        >
          <p style={{ ...theme.FontStyles.roboto.Regular12px, width: "60px" }}>
            {t("realization")}
          </p>
          <S.LogoContainer>
            <GliderLogo style={{ alignSelf: "center" }} />
          </S.LogoContainer>

          <p style={{ ...theme.FontStyles.roboto.Regular12px, width: "60px" }}>Glider</p>
        </S.LinkWrapper>
      </S.Part>
      <S.Part style={{ justifyContent: "flex-end" }}>
        <a href="https://www.netlify.com" style={{ marginRight: "16px" }}>
          <img
            style={{ height: "37px", width: "104px" }}
            src="https://www.netlify.com/img/global/badges/netlify-light.svg"
            alt="Deploys by Netlify"
          />
        </a>
      </S.Part>
    </S.Container>
  );
}
