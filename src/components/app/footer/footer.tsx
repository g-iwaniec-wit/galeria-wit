import "./footer.css";

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer class="footer" data-slot="footer">
			<div class="footer__container app-container" data-slot="footer-container">
				<p class="footer__copyright">&copy; {year} Galeria Malarstwa</p>
			</div>
		</footer>
	);
}
