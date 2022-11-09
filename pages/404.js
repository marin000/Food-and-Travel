import { Card } from 'primereact/card';
import styles from '../styles/404.module.css';

export default function NotFound() {
    return (
        <div className="childrenContent">
            <Card>
                <h1 className={styles.notFoundTitle}>404 Page</h1>
                <h2 className={styles.notFoundText}>Oops! That page cannot be found :(</h2>
            </Card>
        </div>
    )
}