'use client'

import {useEffect} from "react";
import {openobserveRum} from '@openobserve/browser-rum';
import {openobserveLogs} from '@openobserve/browser-logs';
import {generateUUID} from "@openobserve/browser-core";
import {faker} from "@faker-js/faker/locale/ko";

export function OpenobserveRum({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        const options = {
            clientToken: 'rumznUIbIoCIuFWjaRy',
            applicationId: 'web-application-id',
            site: 'localhost:5080',
            service: 'my-web-application',
            env: 'production',
            version: '0.0.1',
            organizationIdentifier: 'default',
            insecureHTTP: true,
            apiVersion: 'v1',
        };

        openobserveRum.init({
            applicationId: options.applicationId, // required, any string identifying your application
            clientToken: options.clientToken,
            site: options.site,
            organizationIdentifier: options.organizationIdentifier,
            service: options.service,
            env: options.env,
            version: options.version,
            trackResources: true,
            trackLongTasks: false,
            trackUserInteractions: true,
            apiVersion: options.apiVersion,
            insecureHTTP: options.insecureHTTP,
            defaultPrivacyLevel: 'mask-user-input', // 'allow' or 'mask-user-input' or 'mask'. Use one of the 3 values.
        });

        openobserveLogs.init({
            clientToken: options.clientToken,
            site: options.site,
            organizationIdentifier: options.organizationIdentifier,
            service: options.service,
            env: options.env,
            version: options.version,
            forwardErrorsToLogs: true,
            insecureHTTP: options.insecureHTTP,
            apiVersion: options.apiVersion,
        });

        // You can set a user context
        openobserveRum.setUser({
            id: generateUUID(),
            name: faker.person.fullName(),
            email: faker.internet.email()
        });

        openobserveRum.startSessionReplayRecording();
    }, []);

    return (
        <>{children}</>
    );
}
